/*
  Warnings:

  - You are about to drop the column `transcript` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "transcript";

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "speaker" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranscriptSegment_meetingId_createdAt_idx" ON "TranscriptSegment"("meetingId", "createdAt");

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
