declare namespace IResponseEmbeddable {
    export interface IResponseEmbeddable {
        id: string;
        name: string;
        description: string;
        type: string;
        data: any;
        createdAt: Date;
        updatedAt: Date;
    }
}
export default IResponseEmbeddable;
export { IResponseEmbeddable };