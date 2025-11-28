import { useState } from 'react';
import { OrganizationStructureTabs } from '../components/features/organization/OrganizationStructureTabs';
import { LegalEntitiesTab } from '../components/features/organization/tabs/LegalEntitiesTab';
import { BusinessUnitTab } from '../components/features/organization/tabs/BusinessUnitTab';
import { LocationTab } from '../components/features/organization/tabs/LocationTab';
import { DepartmentTab } from '../components/features/organization/tabs/DepartmentTab';

export const OrganizationStructurePage = () => {
  const [activeTab, setActiveTab] = useState<string>('legal-entities');

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <OrganizationStructureTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content - Full Height */}
      <div className="flex-1 overflow-hidden">
        <OrganizationStructureTabsContent
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

interface OrganizationStructureTabsContentProps {
  activeTab: string;
}

const OrganizationStructureTabsContent = ({
  activeTab,
}: OrganizationStructureTabsContentProps) => {
  switch (activeTab) {
    case 'legal-entities':
      return <LegalEntitiesTab />;
    case 'business-unit':
      return <BusinessUnitTab />;
    case 'location':
      return <LocationTab />;
    case 'department':
      return <DepartmentTab />;
    default:
      return <LegalEntitiesTab />;
  }
};

