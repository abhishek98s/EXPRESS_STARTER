import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';
import { ChipModel } from './chip.model';
import * as ChipDAO from './chip.repository';
import { chipExceptionMessages } from './constant/chipExceptionMessages';

/**
 * The function `findChipById` retrieves a chip from a database based on its ID and throws an error if
 * the chip is not found.
 * @param {number} chipId - The `chipId` parameter is a number that represents the ID of the chip you
 * want to find.
 * @returns a Promise that resolves to a ChipModel object.
 */
export const findChipById = async (chipId: number) => {
  const chip: ChipModel = await ChipDAO.fetchById(chipId);

  if (!chip)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      chipExceptionMessages.CHIP_NOT_FOUND,
    );

  return chip;
};

/**
 * The function `findAllChips` retrieves all chip models from a database using knex and returns them as
 * a promise.
 * @returns an array of ChipModel objects.
 */
export const findAllChips = async (user_id: number): Promise<ChipModel[]> => {
  const chips: ChipModel[] = await ChipDAO.fetchAll(user_id);
  return chips;
};

/**
 * The function `addChip` inserts a new chip into the database and returns the inserted chip.
 * @param {ChipModel} chipData - The `chipData` parameter is an object of type `ChipModel` that
 * contains the data for the chip that needs to be added.
 * @returns a Promise that resolves to a ChipModel object.
 */
export const addChip = async (chipData: ChipModel) => {
  const chip = await ChipDAO.create(chipData);

  if (!chip)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      chipExceptionMessages.ADD_FAILED,
    );

  const { chipID } = chip;

  return await findChipById(chipID);
};

/**
 * The function updates a chip record in the database with the provided data and returns the updated
 * chip.
 * @param {ChipModel} chipData - The `chipData` parameter is an object of type `ChipModel` that
 * contains the updated data for the chip. It represents the new values that will be updated in the
 * database for the chip with the specified `chipId`.
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that needs to
 * be updated. It is used to locate the specific chip in the database table.
 * @returns the updated chip data.
 */
export const updateChip = async (chipData: ChipModel, chipId: number) => {
  const chip = await ChipDAO.update(chipData, chipId);

  if (!chip)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      chipExceptionMessages.UPDATE_FAILED,
    );

  return await findChipById(chipId);
};

/**
 * The function removes a chip from the database based on its ID
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that needs to
 * be removed.
 * @returns the deleted chip.
 */
export const removeChip = async (chipId: number) => {
  const currentChip = await findChipById(chipId);
  if (!currentChip)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      chipExceptionMessages.REMOVE_FAILED,
    );

  const chip = await ChipDAO.remove(chipId);
  if (!chip)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      chipExceptionMessages.REMOVE_FAILED,
    );

  return currentChip;
};
