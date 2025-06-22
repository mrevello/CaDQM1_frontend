import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
  Card,
  PaperProps,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';
import { SqlEditor } from '../SQLEditor';
import {
  dataProfilingApi,
  RawRow,
  SQLQueryBody,
  SQLQueryResponse,
} from '../../../api/dataProfiling.api';
import { useNotification } from '../../../context/notification.context';
import { NewProblemDialog } from '../../NewProblemDialog';
import Draggable from 'react-draggable';
import { Close } from '@mui/icons-material';
import { Schema } from '../../../types/dataProfiling';
import { useDQProblems } from '../../../hooks/useDQProblems';

interface SQLQueryDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  schema?: Schema;
}

const PaperComponent = (props: PaperProps) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
};

export const SQLQueryDialog: React.FC<SQLQueryDialogProps> = ({
  open,
  onClose,
  projectId,
  schema,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const {
    handleCreateProblem,
    handleCloseNewProblemDialog,
    handleNewProblemSubmit,
    problemErrors,
    newProblemDialogOpen,
  } = useDQProblems({ projectId });

  const [sql, setSql] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SQLQueryResponse>();

  const INITIAL_ROWS = 50;
  const INCREMENT = 50;
  const [displayCount, setDisplayCount] = useState(INITIAL_ROWS);
  const visibleRows = result ? result.rows.slice(0, displayCount) : [];

  useEffect(() => {
    if (result) {
      setDisplayCount(INITIAL_ROWS);
    }
  }, [result]);

  const run = async () => {
    setLoading(true);
    try {
      let query = sql.trim();

      if (query.endsWith(';')) query = query.slice(0, -1);
      if (!/limit\s+\d+/i.test(query)) query += ' LIMIT 500';

      const data: SQLQueryBody = { projectId, sql: query };
      const response = await dataProfilingApi.runSQLQuery(data);
      if (response) setResult(response);
    } catch (error: any) {
      console.error(error);
      showError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
        PaperComponent={PaperComponent}
        maxWidth="md"
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title" sx={{ cursor: 'move', py: 2, px: 3 }}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Typography variant="h6">{t('sql-query')}</Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <IconButton onClick={onClose} sx={{ p: 0 }}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column">
            <SqlEditor value={sql} onChange={setSql} schema={schema} />

            <Box display="flex" justifyContent="end" mt={1}>
              <Button
                endIcon={<PlayArrowIcon />}
                loading={loading}
                disabled={sql.trim() === ''}
                variant="contained"
                onClick={run}
              >
                {loading ? t('running') : t('run-query')}
              </Button>
            </Box>

            {result && (
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2">
                  {result.rows.length} {t(result.rows.length === 1 ? 'row' : 'rows')}
                </Typography>

                <TableContainer
                  component={Card}
                  sx={{
                    maxHeight: 300,
                    borderRadius: 1,
                    overflowY: 'auto',
                  }}
                  onScroll={e => {
                    const target = e.currentTarget;
                    if (
                      target.scrollHeight - target.scrollTop <= target.clientHeight + 100 &&
                      displayCount < result.rows.length
                    ) {
                      setDisplayCount(c => Math.min(c + INCREMENT, result.rows.length));
                    }
                  }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {result.columns.map(col => (
                          <TableCell key={col} sx={{ minWidth: 150, px: 1, py: 1.5, fontSize: 14 }}>
                            {col}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {visibleRows.map((row: RawRow, idx) => (
                        <TableRow key={idx} hover>
                          {result.columns.map(col => {
                            const cellValue = String(row[col] ?? 'null');
                            const isLong = cellValue.length > 40;
                            return (
                              <TableCell key={col} sx={{ px: 1, py: 0.8 }}>
                                <Tooltip title={cellValue} arrow disableHoverListener={!isLong}>
                                  <Box
                                    display="-webkit-box"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    fontSize={12}
                                    sx={{
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {cellValue}
                                  </Box>
                                </Tooltip>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" width="100%">
                  <Button size="small" onClick={handleCreateProblem}>
                    {t('identify-problem')}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <NewProblemDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
      />
    </>
  );
};
