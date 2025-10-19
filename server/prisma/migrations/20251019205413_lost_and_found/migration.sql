/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `claim` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `recipientName` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `item` table. All the data in the column will be lost.
  - Added the required column `claimerContact` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimerName` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterContact` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterName` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `claim` DROP COLUMN `createdAt`,
    ADD COLUMN `claimerContact` VARCHAR(191) NOT NULL,
    ADD COLUMN `claimerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `createdAt`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `recipientName`,
    DROP COLUMN `senderName`,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `reporterContact` VARCHAR(191) NOT NULL,
    ADD COLUMN `reporterName` VARCHAR(191) NOT NULL,
    ADD COLUMN `returnDate` DATETIME(3) NULL;
