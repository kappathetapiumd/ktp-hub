type Props = {
  token: string;
};

export function EmailTemplate({ token }: Props) {
  const params = new URLSearchParams({
    token
  });
  
  const resetUrl = 
    `https://${process.env.DOMAIN}/reset-password?${params.toString()}`;

  return (
    <div style={styles.page}>
      <span style={styles.preview}>Reset your KTP Hub password.</span>

      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td align="center" style={styles.outerCell}>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={styles.card}
              >
                <tbody>
                  <tr>
                    <td style={styles.header}>
                      <p style={styles.brand}>KTP HUB</p>
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.content}>
                      <h1 style={styles.heading}>Reset your password</h1>
                      <p style={styles.paragraph}>
                        We received a request to reset the password for your
                        account. Click the button below to choose a new one.
                      </p>

                      <table
                        role="presentation"
                        cellPadding="0"
                        cellSpacing="0"
                        style={styles.buttonTable}
                      >
                        <tbody>
                          <tr>
                            <td align="center" style={styles.buttonCell}>
                              <a href={resetUrl} style={styles.button}>
                                Reset password
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <p style={styles.paragraph}>
                        If you did not request a password reset, you can safely
                        ignore this email. Your password will remain unchanged.
                      </p>
                      <p style={styles.fallbackText}>
                        If the button does not work, copy and paste this link
                        into your browser:
                      </p>
                      <p style={styles.linkContainer}>
                        <a href={resetUrl} style={styles.link}>
                          {resetUrl}
                        </a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.footer}>
                      <p style={styles.footerText}>
                        This is an automated message from KTP Hub.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f4f4f5',
    color: '#27272a',
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: '0',
    padding: '0',
    width: '100%'
  },
  preview: {
    display: 'none',
    fontSize: '1px',
    lineHeight: '1px',
    maxHeight: '0',
    maxWidth: '0',
    opacity: '0',
    overflow: 'hidden'
  },
  outerCell: {
    padding: '40px 16px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    borderCollapse: 'separate' as const,
    borderRadius: '12px',
    maxWidth: '600px',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#18181b',
    padding: '24px 40px'
  },
  brand: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '2px',
    margin: '0'
  },
  content: {
    padding: '40px'
  },
  heading: {
    color: '#18181b',
    fontSize: '28px',
    lineHeight: '36px',
    margin: '0 0 20px'
  },
  paragraph: {
    color: '#52525b',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 24px'
  },
  buttonTable: {
    margin: '8px 0 32px'
  },
  buttonCell: {
    backgroundColor: '#18181b',
    borderRadius: '6px'
  },
  button: {
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '700',
    padding: '14px 24px',
    textDecoration: 'none'
  },
  fallbackText: {
    color: '#71717a',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0 0 8px'
  },
  linkContainer: {
    margin: '0',
    overflowWrap: 'anywhere' as const,
    wordBreak: 'break-word' as const
  },
  link: {
    color: '#2563eb',
    fontSize: '14px',
    lineHeight: '22px'
  },
  footer: {
    backgroundColor: '#fafafa',
    borderTop: '1px solid #e4e4e7',
    padding: '20px 40px'
  },
  footerText: {
    color: '#71717a',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0'
  }
};
