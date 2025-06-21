import { StyleSheet } from '@react-pdf/renderer';
import { State } from '../../types/state';
import { themePalette } from '../../config/theme.config';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#333',
  },
  section: {
    marginBottom: 10,
    gap: 4,
  },
  sectionSmall: {
    marginBottom: 12,
    gap: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
  },
  smallText: {
    fontSize: 10,
  },
  smallTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  filesContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'column',
    gap: 3,
  },
  fileItem: {
    width: '100%',
    flexDirection: 'row',
    gap: 6,
    paddingLeft: 4,
  },
  error: {
    color: '#d32f2f',
    fontSize: 10,
  },
  loading: {
    color: '#666',
    fontSize: 10,
  },
  dividerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 8,
  },
  [State.DONE]: {
    color: themePalette.SUCCESS,
  },
  [State.IN_PROGRESS]: {
    color: themePalette.INFO,
  },
  [State.TO_DO]: {
    color: themePalette.GRAY_TEXT,
  },
});
