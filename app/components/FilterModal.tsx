"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: string[];
  selectedTopics: string[];
  onApply: (topics: string[]) => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  topics,
  selectedTopics,
  onApply,
}: FilterModalProps) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedTopics);

  // Reset temporary selection when modal opens
  useEffect(() => {
    setTempSelected(selectedTopics);
  }, [selectedTopics, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-gray-800 p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Topics
          </Dialog.Title>

          <div className="space-y-3">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(topic)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTempSelected([...tempSelected, topic]);
                    } else {
                      setTempSelected(tempSelected.filter((t) => t !== topic));
                    }
                  }}
                  className="rounded border-gray-600"
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={onClose} className="text-gray-400">
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(tempSelected);
                onClose();
              }}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FilterModal;
