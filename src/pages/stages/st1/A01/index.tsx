import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams } from 'react-router-dom';
import { a01Validate } from '../../../../utils/validateForm';
import { ActivityHandle } from '../../Stagelayout';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { dataAtHandApi, DataAtHandBody } from '../../../../api/dataAtHand.api';
import { DataAtHand } from '../../../../types/dataAtHand';
import { projectsApi } from '../../../../api/projects.api';
import { useNotification } from '../../../../context/notification.context';

type A01ErrorsType = {
  name?: string;
  description?: string;
  host?: string;
  port?: string;
  database?: string;
  user?: string;
  password?: string;
};

export const A01: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const { showError } = useNotification();

  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [loading, setLoading] = useState(true);
  const [dataAtHand, setDataAtHand] = useState<DataAtHand>({
    id: 0,
    name: '',
    description: '',
    host: '',
    port: '',
    database: '',
    user: '',
    password: '',
  });

  const [errors, setErrors] = useState<A01ErrorsType>({});

  const descriptionRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);
  const portRef = useRef<HTMLInputElement>(null);
  const databaseRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDataAtHand = async () => {
      try {
        setLoading(true);
        const project = await projectsApi.getProject(Number(projectId));

        const dataAtHandId = Number(project?.dataAtHand?.id);
        const dataAtHand = await dataAtHandApi.getDataAtHand(dataAtHandId);
        if (dataAtHand) setDataAtHand(dataAtHand);
      } catch (error) {
        console.error('Failed to fetch review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAtHand();
  }, [projectId]);

  const validateForm = useCallback(async () => {
    try {
      await a01Validate.validate(dataAtHand, { abortEarly: false });
      setErrors({});

      const payload: DataAtHandBody = {
        name: dataAtHand.name,
        description: dataAtHand.description,
        url_db: `${dataAtHand.host}:${dataAtHand.port}/${dataAtHand.database}`,
        user_db: dataAtHand.user,
        pass_db: dataAtHand.password,
        project: Number(projectId),
      };

      if (dataAtHand.id !== 0) {
        await dataAtHandApi.updateDataAtHand(dataAtHand.id, payload);
      } else {
        const created = await dataAtHandApi.createDataAtHand(payload);
        setDataAtHand(prev => ({ ...prev, id: created.id }));
      }

      return true;
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      showError(String(err));
      return false;
    }
  }, [dataAtHand, projectId]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, dataAtHand, validateForm]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const renderGridRow = (label: string, input: React.ReactNode) => (
    <Grid container spacing={2}>
      <Grid size={3}>
        <Typography variant="subtitle2">{label}</Typography>
      </Grid>
      <Grid size={9}>{input}</Grid>
    </Grid>
  );

  return loading ? (
    <CircularProgress />
  ) : (
    <Box component="form" display="flex" flexDirection="column" gap={2}>
      {renderGridRow(
        t('name'),
        <TextField
          fullWidth
          variant="outlined"
          value={dataAtHand.name}
          placeholder={t('dataset-name')}
          onChange={e => {
            setDataAtHand(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) {
              setErrors(prev => ({ ...prev, name: undefined }));
            }
          }}
          error={!!errors.name}
          helperText={errors.name}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              descriptionRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t('description'),
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={dataAtHand.description}
          placeholder={t('dataset-description')}
          onChange={e => {
            setDataAtHand(prev => ({ ...prev, description: e.target.value }));
            if (errors.description) {
              setErrors(prev => ({ ...prev, description: undefined }));
            }
          }}
          error={!!errors.description}
          helperText={errors.description}
          inputRef={descriptionRef}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              hostRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t('url'),
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <TextField
            fullWidth
            variant="outlined"
            value={dataAtHand.host}
            placeholder={t('host')}
            onChange={e => {
              setDataAtHand(prev => ({ ...prev, host: e.target.value }));
              if (errors.host) {
                setErrors(prev => ({ ...prev, host: undefined }));
              }
            }}
            error={!!errors.host}
            helperText={errors.host}
            inputRef={hostRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                portRef.current?.focus();
              }
            }}
          />
          <Typography>:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={dataAtHand.port}
            placeholder={t('port')}
            onChange={e => {
              setDataAtHand(prev => ({ ...prev, port: e.target.value }));
              if (errors.port) {
                setErrors(prev => ({ ...prev, port: undefined }));
              }
            }}
            error={!!errors.port}
            helperText={errors.port}
            inputRef={portRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                databaseRef.current?.focus();
              }
            }}
          />
          <Typography>/</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={dataAtHand.database}
            placeholder={t('database')}
            onChange={e => {
              setDataAtHand(prev => ({ ...prev, database: e.target.value }));
              if (errors.database) {
                setErrors(prev => ({ ...prev, database: undefined }));
              }
            }}
            error={!!errors.database}
            helperText={errors.database}
            inputRef={databaseRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                userRef.current?.focus();
              }
            }}
          />
        </Box>
      )}

      {renderGridRow(
        t('user'),
        <TextField
          fullWidth
          variant="outlined"
          value={dataAtHand.user}
          placeholder={t('database-user')}
          onChange={e => {
            setDataAtHand(prev => ({ ...prev, user: e.target.value }));
            if (errors.user) {
              setErrors(prev => ({ ...prev, user: undefined }));
            }
          }}
          error={!!errors.user}
          helperText={errors.user}
          inputRef={userRef}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              passwordRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t('password'),
        <TextField
          fullWidth
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('database-password')}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          variant="outlined"
          value={dataAtHand.password}
          onChange={e => {
            setDataAtHand(prev => ({ ...prev, password: e.target.value }));
            if (errors.password) {
              setErrors(prev => ({ ...prev, password: undefined }));
            }
          }}
          error={!!errors.password}
          helperText={errors.password}
          inputRef={passwordRef}
        />
      )}
    </Box>
  );
};
