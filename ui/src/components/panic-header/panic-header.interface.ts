import { BaseChain } from "../../interfaces/chains";
import { DropdownMenuOptionType } from "../../lib/types/types/dropdownmenu";

export interface PanicHeaderInterface {
    
    /**
     * A list of base chains used to build the array of links assigned to {@link PanicHeaderInterface._menuOptions _menuOptions} prop.
     */
    _baseChains: BaseChain[],

    /**
     * A list of links displayed in the dropdown menu.
     */
    _menuOptions: DropdownMenuOptionType[]
}