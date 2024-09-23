import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FAQ = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions" />
        
        <Box 
            sx={{maxHeight: '75vh', overflowY: 'auto'}}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        What is the Steam Investment Helper?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        This application helps users track item prices in games on the Steam platform and analyze their profits and losses
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Are my items visible to other users?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        We know that money loves silence, which is why we don't share any information about your investments with other users or websites.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                    How to edit item details?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        To edit item details, double click on wanted field. Editable fields are Quantity and Purchase price. 
                        You can't edit item name, if you want to change it then delete the item and add a new one.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Can I view the price history of items?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Yes, on Investments page you have access to 30-day price history of a given item. 
                        To get price and day data, simply hover over the chart. 
                        For a more complete history, go to Price history page.  
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Why can't I see chart data and current price?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Fetching data from the Steam server is taking a while.
                        This usually happens when fetching data for an item that we don't have in our database yet. 
                        Try refreshing the page, and if that doesn't help, contact us.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Why are prices displayed only in dollars?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <p>
                        This is mainly because Steam is very sensitive to too many requests (3 currencies means 3 times more requests)
                        but also due to differences between currencies and how Steam counts them. 
                        For example, $0.03 corresponds to 0.03, 0.04 and 0.05 PLN, which does not quite match the current exchange rate (1 USD = 3.86086 PLN).
                        </p><br />

                        <p>
                            We do not rule out that in the future this problem will be solved by us, but for now only one currency is available. 
                            However, you can easily add your items with the purchase price in your currency!
                        </p>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        How to set goal displayed on finances page?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Go to user settings (top right corner) and set any item you want to save for.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        How to change my currency?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Go to user settings (top right corner) and set your currency (USD, EUR, PLN) or change it when adding a new item.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        How suggested items page works?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        TODO
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        There is no answer to the question that bothers me
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Feel free to contact us! 
                        Write to <b>example@example.com</b> and we will respond as soon as possible.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
      </Box>
    );
  };
  
  export default FAQ;