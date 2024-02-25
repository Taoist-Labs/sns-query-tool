import { Box, Flex, Separator, Text, Table, Button } from "@radix-ui/themes";
import { useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function ResultPanel({ data }) {
  const tableRef = useRef();
  const onCopy = () => {
    const copyList = data.map((item) => `${item[0]} ${item[1]}`);
    console.log(copyList);
    navigator.clipboard.writeText(copyList.join("\n"));
    toast.success("Copied to clipboard!");
  };
  const onExport = () => {
    if (!tableRef.current) {
      throw new Error("没有获取到表格的根 dom 元素");
    }
    const options = { raw: true };
    const workbook = XLSX.utils.table_to_book(tableRef.current, options);
    return XLSX.writeFile(workbook, "sns-parse-result.xlsx", {
      type: "binary",
    });
  };
  return (
    <Box mb="9">
      <Flex align="center" justify="center" gap="4" style={{ height: 96 }}>
        <Separator orientation="horizontal" size="3" />
        <Text>Parse Result</Text>
        <Separator orientation="horizontal" size="3" />
      </Flex>
      <Flex mb="2">
        <Button mr="2" variant="surface" onClick={onCopy}>
          Copy
        </Button>
        <Button variant="surface" onClick={onExport}>
          Export
        </Button>
      </Flex>
      <Table.Root variant="surface" ref={tableRef}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>SNS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((item, i) => (
            <Table.Row key={i}>
              <Table.RowHeaderCell>{item[0]}</Table.RowHeaderCell>
              <Table.Cell>{item[1]}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
