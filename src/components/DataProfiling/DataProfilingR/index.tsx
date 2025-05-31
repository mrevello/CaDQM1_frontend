import React from "react";
import { Card } from "@mui/material";
import { TableDetailTitle } from "../TableDetailTitle";

interface DataProfilingRProps {
  table: string;
  html: string;
}

export const DataProfilingR: React.FC<DataProfilingRProps> = ({
  table,
  html,
}) => {
  return (
    <Card
      sx={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TableDetailTitle p={3} table={table} />

      <iframe
        title="R Profiling Report"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={`
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <style>
                    html, body {
                      background-color: #f8f9fa !important;
                    }
                    #header,
                    #TOC {
                      display: none !important;
                    }
                  </style>
                  <script>
                    document.addEventListener('click', function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }, true);
                  </script>
                </head>
                <body>
                  ${html}
                </body>
              </html>
            `}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Card>
  );
};
