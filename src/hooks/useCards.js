import { useContext } from "react";
import { CardsContext } from "contexts/CardsContext";

const useCards = () => useContext(CardsContext);
export default useCards;