export const colors = {
  primary: '#4CAF50',
  background: '#FFFFFF',
  card: '#f5f5f5',
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#FFFFFF',
  },
  border: '#ddd',
  success: 'green',
  error: 'red',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
};

export const typography = {
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
  },
};

export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
  },
}; 