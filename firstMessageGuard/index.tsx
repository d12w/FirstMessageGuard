/*
 * FirstMessageGuard
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";
import { ConfirmModal, openModal } from "@webpack/common";

type ChannelSelectEvent = {
    channelId?: string | null;
};

let activeChannelId: string | null = null;
let visitSequence = 0;
let confirmedForCurrentVisit = false;
let confirmationPending = false;

function resetVisitState() {
    activeChannelId = null;
    visitSequence++;
    confirmedForCurrentVisit = false;
    confirmationPending = false;
}

function onChannelSelect({ channelId }: ChannelSelectEvent) {
    const nextChannelId = typeof channelId === "string" ? channelId : null;

    // Re-selecting the already active channel does not start a new visit.
    if (nextChannelId === activeChannelId) return;

    activeChannelId = nextChannelId;
    visitSequence++;
    confirmedForCurrentVisit = false;
}

function getChannelLabel(channel: { name?: string | null; guild_id?: string | null } | undefined) {
    const name = channel?.name?.trim();
    if (!name) return "this conversation";
    return channel?.guild_id ? `#${name}` : `“${name}”`;
}

function showFirstMessageConfirmation(channelLabel: string): Promise<boolean> {
    return new Promise(resolve => {
        let settled = false;

        const finish = (confirmed: boolean) => {
            if (settled) return;
            settled = true;
            resolve(confirmed);
        };

        openModal(modalProps => (
            <ConfirmModal
                {...modalProps}
                title="You're in a new channel"
                subtitle={`This is your first message since entering ${channelLabel}.`}
                confirmText="Send message"
                cancelText="Go back"
                variant="primary"
                onConfirm={() => finish(true)}
                onCancel={() => finish(false)}
                onCloseCallback={() => finish(false)}
            >
                <div>
                    <p>You are about to send your first message in this channel during the current visit.</p>
                    <p>Please make sure this is the correct place before sending.</p>
                </div>
            </ConfirmModal>
        ));
    });
}

export default definePlugin({
    name: "FirstMessageGuard",
    description: "Confirms your first message every time you enter a channel.",
    authors: [{ name: "d12w", id: 0n }],
    tags: ["Chat", "Utility"],
    dependencies: ["MessageEventsAPI"],

    flux: {
        CHANNEL_SELECT: onChannelSelect
    },

    start() {
        resetVisitState();
    },

    stop() {
        resetVisitState();
    },

    onBeforeMessageSend: async (channelId, _message, _options, props) => {
        if (!channelId) return;

        // Fallback for startup cases where the initial CHANNEL_SELECT event
        // happened before this plugin started listening.
        if (activeChannelId !== channelId) {
            activeChannelId = channelId;
            visitSequence++;
            confirmedForCurrentVisit = false;
        }

        if (confirmedForCurrentVisit) return;

        // Do not stack confirmation dialogs or allow a second send attempt
        // while the first confirmation is still open.
        if (confirmationPending) return { cancel: true };

        confirmationPending = true;
        const visitAtPrompt = visitSequence;
        const channelLabel = getChannelLabel(props?.channel);

        try {
            const confirmed = await showFirstMessageConfirmation(channelLabel);
            if (!confirmed) return { cancel: true };

            // If the user changed channels (including leaving and returning)
            // while the dialog was open, cancel this stale send attempt.
            if (activeChannelId !== channelId || visitSequence !== visitAtPrompt) {
                return { cancel: true };
            }

            confirmedForCurrentVisit = true;
        } catch {
            // Fail open: a dialog/API issue must not break normal message sending.
            return;
        } finally {
            confirmationPending = false;
        }
    }
});
