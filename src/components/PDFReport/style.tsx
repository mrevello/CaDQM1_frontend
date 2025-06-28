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
  dividerStyle: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pdfContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
});

export const textStyles = StyleSheet.create({
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
  metaText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 10,
    color: themePalette.ERROR,
  },
});

export const stateStyles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: 'bold',
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
