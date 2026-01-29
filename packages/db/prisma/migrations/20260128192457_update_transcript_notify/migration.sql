CREATE OR REPLACE FUNCTION notify_transcript_insert()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'transcript_insert',
    json_build_object(
      'id', NEW.id,
      'createdAt', NEW."createdAt"
      'meetingId', NEW."meetingId",
      'text', NEW.text, 
      'timestamp', NEW.timestamp,
      'isFinal', NEW."isFinal",
      'speaker', NEW.speaker
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transcript_insert_trigger ON "TranscriptSegment";

CREATE TRIGGER transcript_insert_trigger
AFTER INSERT ON "TranscriptSegment"
FOR EACH ROW
EXECUTE FUNCTION notify_transcript_insert();
