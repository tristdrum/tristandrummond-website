"use client";

import { Dialog } from "@headlessui/react";
import type { Topic, LifeDomain } from "@/lib/types";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedTopicIds: string[];
  onTopicSelect: (topicId: string) => void;
  lifeDomains?: LifeDomain[];
  selectedLifeDomainId?: string | null;
  onLifeDomainSelect?: (lifeDomainId: string) => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  topics,
  selectedTopicIds,
  onTopicSelect,
  lifeDomains = [],
  selectedLifeDomainId,
  onLifeDomainSelect,
}: FilterModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-gray-800 p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Filter Content
          </Dialog.Title>

          {lifeDomains.length > 0 && onLifeDomainSelect && (
            <>
              <h3 className="font-medium mb-2">Life Domains</h3>
              <div className="space-y-2 mb-4">
                {lifeDomains.map((domain) => (
                  <label
                    key={domain.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={selectedLifeDomainId === domain.id}
                      onChange={() => onLifeDomainSelect(domain.id.toString())}
                      className="rounded border-gray-300"
                    />
                    <span>{domain.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <h3 className="font-medium mb-2">Topics</h3>
          <div className="space-y-2">
            {topics.map((topic) => (
              <label
                key={topic.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTopicIds.includes(topic.id)}
                  onChange={() => onTopicSelect(topic.id)}
                  className="rounded border-gray-300"
                />
                <span>{topic.name}</span>
              </label>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FilterModal;
