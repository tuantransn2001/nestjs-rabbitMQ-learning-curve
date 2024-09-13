import mongoose, { Document, FilterQuery, Model, QueryOptions } from 'mongoose';

export interface BaseCRUDRepository<T> {
  create(dto: T): Promise<T>;
  pureOne(id: mongoose.Types.ObjectId, projection?: T): Promise<T | null>;
  findOneByCondition(condition?: FilterQuery<T>, projection?: T): Promise<T>;
  update(filter: FilterQuery<T>, dto: Partial<T>): Promise<T>;
  findAll(
    condition?: FilterQuery<T>,
    projection?: T,
    options?: QueryOptions,
  ): Promise<T[]>;
}

export class BaseCRUDRepositoryImpl<T extends Document>
  implements BaseCRUDRepository<T>
{
  protected readonly _model: Model<T>;

  constructor(protected readonly model: Model<T>) {
    this._model = model;
  }

  public async findAll(
    condition?: FilterQuery<T>,
    projection?: T,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this._model.find(condition, projection, options).exec();
  }

  public async create(dto: T): Promise<T> {
    const created_document = await this._model.create(dto);
    return created_document?.toObject();
  }

  public async pureOne(
    id: mongoose.Types.ObjectId,
    projection?: T,
  ): Promise<T | null> {
    const founded_document = await this._model.findById(id, projection);
    return founded_document?.toObject();
  }

  public async findOneByCondition(condition: FilterQuery<T>): Promise<T> {
    return this._model.findOne(condition).exec();
  }

  public async update(filter: FilterQuery<T>, dto: Partial<T>): Promise<T> {
    return this._model.findOneAndUpdate(filter, dto, { new: true });
  }
}
