import {
  Html,
  Head,
  Preview,
  Section,
  Text,
  Heading,
  //   Row,
  //   Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email to continue</Preview>
      <Section style={main}>
        <Container style={container}>
          <Heading as="h2" style={heading}>
            Hello {username}, welcome aboard!
          </Heading>
          <Text style={text}>
            Thanks for signing up. Please verify your account by using the OTP
            below:
          </Text>
          <Text style={otpText}>{otp}</Text>
          {/* <Text style={text}>
            Or simply click the button below to verify your account:
          </Text>
          <Row style={{ textAlign: "center", margin: "24px 0" }}>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={button}
            >
              Verify Now
            </Button>
          </Row> */}
          <Text style={footerText}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f9f9f9",
  padding: "40px 0",
  fontFamily: "Helvetica, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "8px",
  maxWidth: "480px",
  margin: "0 auto",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const heading = {
  color: "#333333",
  fontSize: "24px",
  marginBottom: "20px",
};

const text = {
  color: "#555555",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const otpText = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#1d4ed8",
  textAlign: "center" as const,
  marginBottom: "20px",
};

// const button = {
//   backgroundColor: "#1d4ed8",
//   color: "#ffffff",
//   fontSize: "16px",
//   padding: "12px 24px",
//   borderRadius: "6px",
//   textDecoration: "none",
// };

const footerText = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "30px",
};
