import { useLocation } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";
import BackButton from "../components/common/BackButton";

const Search = () => {
  const location = useLocation();
  const variant = location.state?.variant || 'light';
  return(
    <div className="relative w-full h-screen flex flex-col mt-14">
      <div className="absolute flex flex-row items-center gap-5 px-2 h-fit  w-full">
        <BackButton/>
        <SearchBar variant={variant} clickable={false} className="mt-0"/>
      </div>
    </div>
  );
}

export default Search;