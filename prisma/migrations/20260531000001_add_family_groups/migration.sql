-- CreateTable
CREATE TABLE `FamilyGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#3b82f6',
    `leaderId` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `familyGroup`,
    ADD COLUMN `familyGroupId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FamilyGroup_name_key` ON `FamilyGroup`(`name`);

-- AddForeignKey
ALTER TABLE `FamilyGroup` ADD CONSTRAINT `FamilyGroup_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_familyGroupId_fkey` FOREIGN KEY (`familyGroupId`) REFERENCES `FamilyGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
