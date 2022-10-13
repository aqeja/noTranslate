import React from "react";
import { Avatar, Box, Typography, Card, Container, Link, Button } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="xs" className="h-screen !flex items-center justify-center" sx={{ mx: "auto" }}>
      <Card className="w-full">
        <Box sx={{ p: 2, py: 4 }}>
          <Avatar
            src="/site-logo-dark.png"
            sx={{
              width: 80,
              height: 80,
            }}
            className="mx-auto"
          ></Avatar>
          <Typography fontWeight="bold" className="text-center" color="text.primary" sx={{ mt: 2 }}>
            不译
          </Typography>
          <Typography className="text-center" fontSize="small" color="text.secondary">
            版本: {__APP_VERSION__}
          </Typography>
          <Link
            sx={{ mt: 2 }}
            className="text-center block"
            href="https://github.com/aqeja/aqeja.github.io"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/aqeja/aqeja.github.io
          </Link>
        </Box>
      </Card>
    </Container>
  );
};

export default About;
