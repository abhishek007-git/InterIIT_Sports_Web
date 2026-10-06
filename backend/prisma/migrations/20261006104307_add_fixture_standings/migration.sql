-- CreateTable
CREATE TABLE "RawEntry" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "enteredBy" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmedResult" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "confirmedBy" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmedResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixtureStanding" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "participantId" TEXT,
    "rank" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FixtureStanding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmedResult_fixtureId_key" ON "ConfirmedResult"("fixtureId");

-- AddForeignKey
ALTER TABLE "RawEntry" ADD CONSTRAINT "RawEntry_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedResult" ADD CONSTRAINT "ConfirmedResult_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixtureStanding" ADD CONSTRAINT "FixtureStanding_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixtureStanding" ADD CONSTRAINT "FixtureStanding_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixtureStanding" ADD CONSTRAINT "FixtureStanding_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
