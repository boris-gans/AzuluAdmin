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
        color="primary"
        elevation={0}
        sx={{
          borderBottom: "2px solid #000",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Azulu Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutOutlined />}
            sx={{
              borderLeft: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 0,
              pl: 2,
              height: "100%",
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
            border: "1px solid #000",
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
            border: "1px solid #000",
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
              borderBottom: "1px solid #000",
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
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <EventList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ContentList />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
