-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "advice" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
