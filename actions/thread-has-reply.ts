"use server";

/**
 * Whether the assistant has answered the latest message in a ChatKit thread.
 * When a workflow run fails (e.g. the OpenAI account is out of credits),
 * ChatKit ends the response silently — this lets the UI notice.
 */
export async function threadHasReply(threadId: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !/^cthr_[a-z0-9]+$/i.test(threadId)) return false;

  const response = await fetch(
    `https://api.openai.com/v1/chatkit/threads/${threadId}/items`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
    },
  );
  if (!response.ok) return false;

  const { data } = (await response.json()) as { data: { type: string }[] };
  return data.at(-1)?.type !== "chatkit.user_message";
}
