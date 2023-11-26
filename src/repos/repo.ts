export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  create(_newItem: Omit<X, 'id'>): Promise<X>; // Omit es que sea del mismo tipo que X pero sin la propiedad id>
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(_id: X['id']): Promise<void>;
}
