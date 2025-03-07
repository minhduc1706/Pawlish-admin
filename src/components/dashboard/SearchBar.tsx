import { Search } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSearch, closeSearch, setQuery } from "@/redux/search/searchSlice";
import { useEffect, useState, KeyboardEvent } from "react";
import { Button } from "../ui/button";

const COMMAND_GROUPS = [
  {
    group: "Task Management",
    items: [
      { label: "Edit Task", icon: "📝" },
      { label: "Create Task", icon: "+" },
      { label: "Add to Tasks", icon: "↵" },
      { label: "Task Done", icon: "✔️" },
      { label: "Delete Task", icon: "🗑️" },
    ],
  },
  {
    group: "Project Management",
    items: [
      { label: "Switch Project", icon: "⇄" },
      { label: "Assign Project", icon: "⇄" },
    ],
  },
  {
    group: "Your Settings",
    items: [{ label: "Search Teams", icon: "🔍" }],
  },
  {
    group: "Tab Suggestions",
    items: [{ label: "Open", icon: "" }],
    footer: true,
  },
];

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const { open, query = "" } = useAppSelector((state) => state.search);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const flattenItems = COMMAND_GROUPS.flatMap((group) => group.items);
  const filteredItems = flattenItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown: EventListener = (e: Event) => {
      const event = e as unknown as KeyboardEvent;

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (open) {
          dispatch(closeSearch());
        } else {
          dispatch(openSearch()); 
        }
        setSelectedIndex(-1); 
        return;
      }

      if (open && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) {
        event.preventDefault();

        let newIndex = selectedIndex;

        switch (event.key) {
          case "ArrowUp":
            newIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1;
            break;
          case "ArrowDown":
            newIndex = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0;
            break;
          case "Enter":
            if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
              dispatch(setQuery(filteredItems[selectedIndex].label));
              dispatch(closeSearch());
            }
            return;
          default:
            break;
        }

        setSelectedIndex(newIndex);
        if (newIndex >= 0 && newIndex < filteredItems.length) {
          dispatch(setQuery(filteredItems[newIndex].label));
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, open, selectedIndex, query, filteredItems.length, filteredItems]);

  const handleQueryChange = (value: string) => {
    dispatch(setQuery(value));
    setSelectedIndex(-1); 
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closeSearch());
      setSelectedIndex(-1); 
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <Button
        onClick={() => dispatch(openSearch())}
        className="relative h-8 w-full flex cursor-pointer justify-start items-center rounded-md bg-white  text-sm font-normal text-gray-700 shadow-none hover:bg-gray-200 sm:pr-12 md:w-40 lg:w-60 xl:w-72 transition-colors border border-gray-300"
      >
        <Search
          size={20}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-700"
        />
        <span className="ml-8">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1 hidden h-5 select-none bg-gray-300 items-center gap-1 rounded px-1.5 text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘/Ctrl+K</span>
        </kbd>
      </Button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black opacity-80 z-10"
          onClick={handleOverlayClick}
        >
          <Command className="w-[600px] rounded-lg border text-black font-bold border-gray-600 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
            <CommandInput
              placeholder="Search or jump to..."
              value={query}
              onValueChange={handleQueryChange}
              className="w-full py-2 border-none focus:outline-none text-black placeholder-gray-300"
              autoFocus
            />
            <CommandList className="max-h-64 overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
              <CommandEmpty className="py-2 text-center text-sm text-gray-400">
                No result.
              </CommandEmpty>
              {COMMAND_GROUPS.map((group, index) => (
                <CommandGroup
                  key={index}
                  heading={group.group}
                  className="text-xs text-gray-400"
                >
                  {group.items.map((item, idx) => (
                    <CommandItem
                      key={idx}
                      onSelect={() => {
                        dispatch(setQuery(item.label));
                        dispatch(closeSearch());
                      }}
                      className={`cursor-pointer py-2 px-3 text-black transition-colors flex justify-between items-center ${
                        query === item.label && "bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                  {group.footer && (
                    <div className="flex justify-between items-center py-2 px-3 text-black">
                      <span>Tab Suggestions</span>
                      <div className="flex gap-1">
                        <button className="border p-1 rounded">Open</button>
                        <span className="text-xs text-gray-400">
                          ↑ ↓ ← → to navigate
                        </span>
                      </div>
                    </div>
                  )}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
