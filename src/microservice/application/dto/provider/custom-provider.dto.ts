export interface CustomProvider {
  get?: { new (...args: any[]) };
  update?: { new (...args: any[]) };
  create?: { new (...args: any[]) };
  repository?: { new (...args: any[]) };
  controller?: { new (...args: any[]) };
}
