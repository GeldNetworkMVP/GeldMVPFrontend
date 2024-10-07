export type MasterDataRecord  = {
    _id: string
    collectionname: string
    dataid: string
} & Record<string, string>