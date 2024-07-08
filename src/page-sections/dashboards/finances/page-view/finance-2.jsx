import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import Balance from "../Balance";
import Footer from "../../_common/Footer";
import DebitCard from "../DebitCard";
import MySavings from "../MySavings";
import Transactions from "../Transactions";
import WalletSummery from "../WalletSummery";
import InvestmentTwo from "../InvestmentTwo";
import TopActivityTwo from "../TopActivityTwo";
import ExpenseHistory from "../ExpenseHistory";
import CurrentCurrencyTwo from "../CurrentCurrencyTwo";
import CustomerTransaction from "../CustomerTransaction";
import OffersList from "../Offers-list";
import TraderOffersList from "../Trader-offers-list";
import VerificationOffersList from "../trader-verif-offers/verification-offers-list";
import { OffersProvider } from "contexts/OffersContext";
import useAuth from "hooks/useAuth";

const Finance2PageView = () => {
  const {
    roleName
  } = useAuth();
  const isTrader = roleName && (roleName === "Owner" || roleName === "Trader");

  return <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        {/* MY BALANCE CARD */}
        <Grid item md={6} xs={12}>
          <Balance />
        </Grid>

        {/* CURRENT CURRENCY CHART CARD */}
        <Grid item md={6} xs={12}>
          <CurrentCurrencyTwo />
        </Grid>

        {/*OFFERS PROVIDER*/}
        <OffersProvider>
            {/* OFFERS LIST CARD */}
            <Grid item xs={12}>
                <OffersList />
            </Grid>
        
            {/* TRADER OFFERS LIST CARD */}
            {isTrader && <Grid item xs={12}>
                <TraderOffersList />
            </Grid>}

            {isTrader && <Grid item xs={12}>
                <VerificationOffersList />
            </Grid>}
        </OffersProvider> 


        {/* TRANSACTION CHART CARD */}
        {/*<Grid item md={8} xs={12}>*/}
        {/*  <Transactions type="line" />*/}
        {/*</Grid>*/}

        {/* YOUR CARD  */}
        {/*<Grid item md={4} xs={12}>*/}
        {/*  <DebitCard />*/}
        {/*</Grid>*/}

        {/* WALLET SUMMERY CARD */}
        {/*<Grid item md={4} xs={12}>*/}
        {/*  <WalletSummery />*/}
        {/*</Grid>*/}

        {/* CUSTOMER TRANSACTION TABLE */}
        {/*<Grid item md={8} xs={12}>*/}
        {/*  <CustomerTransaction />*/}
        {/*</Grid>*/}

        {/* INVESMENT CHART CARD */}
        {/*<Grid item md={8} xs={12}>*/}
        {/*  <InvestmentTwo />*/}
        {/*</Grid>*/}

        {/* TOP ACTIVITY CARD */}
        {/*<Grid item md={4} xs={12}>*/}
        {/*  <TopActivityTwo />*/}
        {/*</Grid>*/}

        {/* MY SAVINGS CARD */}
        {/*<Grid item md={4} xs={12}>*/}
        {/*  <MySavings />*/}
        {/*</Grid>*/}

        {/* AUDITS CARD */}
        {/*<Grid item md={8} xs={12}>*/}
        {/*  <ExpenseHistory />*/}
        {/*</Grid>*/}

        {/* FOOTER CARD */}
        {/*<Grid item xs={12}>*/}
        {/*  <Footer />*/}
        {/*</Grid>*/}
      </Grid>
    </Box>;
};
export default Finance2PageView;