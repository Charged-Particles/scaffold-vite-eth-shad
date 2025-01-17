// Frameworks
import React, { useState } from 'react';
import { cn } from '@/utils/cn';

// App Components
import { Sidebar, SidebarBody } from '../components/ui/sidebar';
import { SideMenu } from '../components/SideMenu';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('AppLayout');
log.debug('initialized');


function AppLayout({ location, children }) {
  const [ open, setOpen ] = useState(false);

  return (
    <>
      <div className={cn('rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen h-screen flex-1 mx-auto overflow-hidden')}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <SideMenu />
          </SidebarBody>
        </Sidebar>
        <div style={{ background: 'linear-gradient(45deg, #3a3a3a 0%, #1a1a1a 100%)' }} className="flex flex-1 overflow-y-scroll md:overflow-hidden rounded-tl-2xl border border-r-0 border-b-0 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <div className="p-2 md:p-10 flex flex-col gap-2 flex-1 w-full h-full md:overflow-y-scroll">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default AppLayout;
