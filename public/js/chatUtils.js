export function getNewMessages(existingMessages, incomingMessages) {
    const existingIds = new Set(
        existingMessages.map((message) => String(message._id)),
    );

    return incomingMessages.filter(
        (message) => !existingIds.has(String(message._id)),
    );
}
