import { Badge, Box/*, Button, Chip*/ } from "@mui/material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { FlexRowAlign } from "components/flexbox";
import { AvatarLoading } from "components/avatar-loading";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";

const UserAccount = () => {
    const {
        userName,
        email
    } = useAuth();

  return <FlexRowAlign flexDirection="column" py={5}>
      <AvatarLoading alt="user" percentage={100} src="/static/avatar/014-man-3.svg" sx={{
        width: 50,
        height: 50
      }} />

      <Box textAlign="center" pt={1.5} pb={3}>
        {/*<Chip variant="outlined" label="60% Complete" size="small" />*/}
        <Paragraph fontSize={16} fontWeight={600} mt={2}>
          {userName ? userName.toUpperCase() : "YOUR NAME"}
        </Paragraph>
        <Paragraph fontSize={13} fontWeight={500} color="text.secondary" mt={0.5}>
          {email ? email : "email@mail.com"}
        </Paragraph>
      </Box>

      {/*<Button>Upgrade to Pro</Button>*/}
    </FlexRowAlign>;
};
export default UserAccount;