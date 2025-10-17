-- CreateTable
CREATE TABLE "BotUser" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_telegramId_key" ON "BotUser"("telegramId");
