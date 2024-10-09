export type GetTransactionsBasedOnPlotIdDto = {
  Status: number;
  Response: {
    _id: string;
    status: string;
    txnhash: string;
    plotid: string;
    tokenid: string;
    dbstatus: string;
  }[];
} | null;
