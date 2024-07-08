import { useContext } from "react";
import { GroupsCardsContext } from "contexts/GroupsCardsContext";

const useGroupsCards = () => useContext(GroupsCardsContext);
export default useGroupsCards;