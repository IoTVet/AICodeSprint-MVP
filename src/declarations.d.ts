declare module 'react-to-print' {
  export function useReactToPrint(options: {
    content: () => React.ReactInstance | null;
  }): () => void;
}

declare module 'xlsx' {
  export const utils: {
    book_new(): any;
    json_to_sheet(data: any[], opts?: any): any;
    book_append_sheet(workbook: any, worksheet: any, name: string): void;
    aoa_to_sheet(data: any[][]): any;
    sheet_add_aoa(worksheet: any, data: any[][], opts?: any): void;
  };
  export function writeFile(workbook: any, filename: string): void;
}