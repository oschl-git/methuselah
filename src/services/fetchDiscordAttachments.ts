import { AttachmentBuilder, Attachment } from "discord.js";
import DiscordAttachmentFetchError from "../errors/DiscordAttachmentFetchError.js";

export async function fetchDiscordAttachments(
  attachments: Iterable<Attachment>,
): Promise<AttachmentBuilder[]> {
  const builders: AttachmentBuilder[] = [];

  for (const attachment of attachments) {
    const response = await fetch(attachment.url);

    if (!response.ok) {
      throw new DiscordAttachmentFetchError(
        `Failed to fetch ${attachment.url}: ${response.status}`,
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      throw new DiscordAttachmentFetchError(
        `Attachment is not an image: ${contentType}`,
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = attachment.name ?? "attachment.png";

    builders.push(new AttachmentBuilder(buffer, { name: filename }));
  }

  return builders;
}
