import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Container,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import EventList from "./events/EventList";
import ContentList from "./content/ContentList";
import MailingList from "./mailing/MailingList";
import DjList from "./dj/DjList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { logout } = useAuth();
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: "white",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/Azulu black.png"
              alt="Azulu Logo"
              style={{
                height: 40,
                marginRight: 10,
              }}
            />
          </Box>
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutOutlined />}
            sx={{
              borderLeft: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 0,
              pl: 2,
              height: "100%",
              color: "black",
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage events and website content
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            indicatorColor="primary"
            textColor="primary"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                backgroundColor: theme.palette.primary.main,
              },
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "0.95rem",
                px: 4,
                py: 2,
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <Tab label="Events" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Content" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Mailing List" id="tab-2" aria-controls="tabpanel-2" />
            {/* <Tab label="DJs" id="tab-3" aria-controls="tabpanel-3" /> */}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <EventList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ContentList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <MailingList />
          </TabPanel>
          {/* <TabPanel value={tabValue} index={3}>
            <DjList />
          </TabPanel> */}
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
