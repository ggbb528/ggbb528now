import {
  faDiscord,
  faFacebook,
  faTwitch,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import opggLogo from '@assets/img/opgglogo.svg';
import { openURL } from '../utils/utility';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Constants } from '@src/configs/constants';
import useGgbb528Accounts from '../hooks/useGgbb528Accounts';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

function Button(props: ButtonProps) {
  const handleOnClick = () => {
    if (props.href) {
      openURL(props.href);
    }
  };
  return (
    <button
      {...props}
      type="button"
      className={`flex-1 py-1 border-black text-blue-600 font-medium text-xs leading-tight
        uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0
        transition duration-150 ease-in-out ${props.className}`}
      onClick={handleOnClick}
    >
      {props.children}
    </button>
  );
}

// Dropdown Item
interface DropdownItemProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}
function DropdownItem(props: DropdownItemProps) {
  const handleOnClick = () => {
    if (props.href) {
      chrome.tabs.create({ url: props.href });
    }
  };

  return (
    <li>
      <a
        className={` dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap 
        bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:text-white 
        focus:bg-gray-700 active:bg-blue-600 ${props.className}`}
        onClick={handleOnClick}
        href="#"
      >
        {props.children}
      </a>
    </li>
  );
}

// Dropdown
interface DropdownProps {
  className?: string;
  children?: React.ReactNode;
  ariaLabelledby?: string;
}

function Dropdown(props: DropdownProps) {
  return (
    <ul
      className={`dropdown-menu min-w-max absolute hidden text-base z-50 float-left py-2
    list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none bg-gray-800
    ${props.className}`}
      aria-labelledby={props.ariaLabelledby}
    >
      {props.children}
    </ul>
  );
}

export default function ButtonsGroup() {
  const { data: accounts } = useGgbb528Accounts();
  const ServerName: {
    [key: string]: string;
  } = {
    kr: '韓服',
    tw: '台服',
  };

  return (
    <div className="container flex items-center justify-center">
      <div className="container flex flex-row" role="group">
        <Button
          className="border rounded-l"
          href={Constants.TWITCH_CHANNEL_URL}
        >
          <FontAwesomeIcon icon={faTwitch} size={'2xl'} color={'#6441a5'} />
        </Button>
        <Button
          className="border-t border-b border-r flex justify-center items-center"
          data-bs-toggle="dropdown"
          id="dropdownMenuButton"
        >
          <img alt="opgg logo" src={opggLogo} className="p-1 w-4/5" />
          <FontAwesomeIcon icon={faCaretDown} className="p-1" />
        </Button>
        <Dropdown ariaLabelledby="dropdownMenuButton">
          {accounts?.map((account) => (
            <DropdownItem key={account.summoner_id} href={account.url}>
              {ServerName[account.server]} - {account.account_id}
            </DropdownItem>
          ))}
        </Dropdown>
        <Button
          className="border-t border-b border-r"
          href={Constants.YOUTUBE_CHANNEL_URL}
        >
          <FontAwesomeIcon icon={faYoutube} size={'2xl'} color={'#ff0000'} />
        </Button>
        <Button
          className="border-t border-b border-r"
          href={Constants.DISCORD_SERVER_URL}
        >
          <FontAwesomeIcon icon={faDiscord} size={'2xl'} color={'#5865f2'} />
        </Button>
        <Button
          className="border-t border-b border-r rounded-r"
          href={Constants.FACEBOOK_FANPAGE_URL}
        >
          <FontAwesomeIcon icon={faFacebook} size={'2xl'} color={'#4267b2'} />
        </Button>
      </div>
    </div>
  );
}
