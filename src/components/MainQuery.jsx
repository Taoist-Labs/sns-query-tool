import { Box, Button, TextArea } from "@radix-ui/themes";
import UploadIconSvg from "../assets/svgs/upload";
import * as XLSX from "xlsx";
import { useState } from "react";
import ResultPanel from "./ResultPanel";
import Loading from "./Spin";
import sns from "@seedao/sns-js";
import { toast } from "react-toastify";

export const AddressZero = "0x0000000000000000000000000000000000000000";

export default function InputPanel() {
  const [areaValue, setAreaValue] = useState("");

  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChooseFile = (e) => {
    const { files } = e.target;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);

    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        const workbook = XLSX.read(result, { type: "binary", codepage: 65001 });
        const to_parse_list = [];

        for (const sheet in workbook.Sheets) {
          const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet], {
            blankrows: false,
          });

          const arrs = csvData.split("\n");
          arrs.forEach((item) => {
            item.split(",").forEach((cellValue) => {
              const _v = String(cellValue).trim();
              if (_v.endsWith(".seedao")) {
                to_parse_list.push(_v);
              }
            });
          });
          break;
        }
        setAreaValue(Array.from(new Set(to_parse_list)).join("\n"));

        console.log("Upload file successful!");
      } catch (e) {
        console.error("Unsupported file type!");
      }
    };
  };

  const onParse = () => {
    const to_be_parsed = [];
    areaValue.split("\n").forEach((item) => {
      const str = item.trim();
      if (str && str.endsWith(".seedao")) {
        to_be_parsed.push(str);
      }
    });
    if (!to_be_parsed.length) {
      toast.error("No SNS found in the input area");
      return;
    }
    setLoading(true);
    const r_list = [];
    const unique_list = Array.from(new Set(to_be_parsed));
    sns
      .resolves(unique_list)
      .then((result) => {
        console.log("result", result);
        result.forEach((r, i) => {
          r_list.push([unique_list[i], r === AddressZero ? "" : r]);
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
    setResultList(r_list);
  };

  return (
    <Box>
      <Box mb="2">
        <Button variant="surface">
          <label
            htmlFor="fileUpload"
            onChange={onChooseFile}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <input
              id="fileUpload"
              accept=".xlsx, .xls, .csv"
              type="file"
              hidden
              onClick={(event) => {
                event.target.value = null;
              }}
            />
            <UploadIconSvg />
            <span>Import File</span>
          </label>
        </Button>
      </Box>
      <TextArea
        variant="soft"
        size="3"
        value={areaValue}
        style={{ height: "300px" }}
        onChange={(e) => setAreaValue(e.target.value)}
        placeholder={`input SNS\ninput SNS\ninput SNS\n`}
      />
      <Box mt="4" style={{ textAlign: "center" }}>
        <Button
          onClick={onParse}
          size="3"
          style={{ width: "100px" }}
          disabled={loading}
        >
          {loading ? <Loading /> : <span>Parse</span>}
        </Button>
      </Box>

      {!loading && resultList.length > 0 && <ResultPanel data={resultList} />}
    </Box>
  );
}
