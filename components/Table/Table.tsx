import React from "react";

interface Column {
  title?: string
  key: string
}

export type TableData = Record<string, string | number>[]

export const Table: React.FC<{columns: Column[]; data: TableData; showHeader?: boolean }> = ({columns, data, showHeader}) => (
  <table>
    {showHeader && <thead>
      <tr>
        {columns.map(({title, key})=> (
          <th key={key}>{title}</th>
        ))}
      </tr>
    </thead>}
    {data && data.length > 0 && (<tbody>
    {data.map((item, index) => (
      <tr key={index}>
        {columns.map((column, index) => (
          <td key={index}>{item[column.key]}</td>
        ))}
      </tr>
    ))}
    </tbody>)}
  </table>
)