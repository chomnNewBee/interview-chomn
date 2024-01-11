import React, { useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { RepositoryOption } from './RepositoryOption'
import { FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

type Repository = {
  id: string
  name: string
  full_name: string
  open_issues_count: number
  stargazers_count: number
  forks_count: number
  url: string
  language: string
  owner: {
    login: string
    avatar_url: string
  }
}

type APIResponse = { items: Repository[] }


export default function Example() {
  const [open, setOpen] = React.useState(true)

  //test list render data
  //const [testItems,setTestItems] = useState<number[]>([1,2,3,4,5,6])
  const [_repoList, setRepoList] = useState<Repository[]>([]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setOpen(true)
      }, 500)
    }
  }, [open])

  const [rawQuery, setRawQuery] = React.useState('')
  const query = rawQuery.toLowerCase().replace(/^[#>]/, '')

  //search and reslove json from github and cast it to standard Repository type(json prop from github is too much)
  const searchFunc = async () => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if(data.items.length > 0){
        const repoList:Repository[] = data.items.map((item:any)=>{
          return mapToRepositoryType(item);
        })
        setRepoList(repoList);
        //console.log(repoList)
    }
    //console.log(data.items.length)
  }
  /**
   * when user press the enter key,We will search
   * @param e handle the key enter event
   */
  const handleKeyDown = (code:string) => {
    
    if (code == "Enter") {
      
      //console.log("回车被按下了，开始搜索！")
      searchFunc()
    }
  };
  const mapToRepositoryType = (item: any): Repository => {
    return {
      id: item.id.toString(),
      name: item.name || '',
      full_name: item.full_name || '',
      open_issues_count: item.open_issues_count || 0,
      stargazers_count: item.stargazers_count || 0,
      forks_count: item.forks_count || 0,
      url: item.html_url || '',
      language: item.language || '',
      owner: {
        login: item.owner?.login || '',
        avatar_url: item.owner?.avatar_url || '',
      },
    };
  };

  return (
    <Transition.Root
      show={open}
      as={React.Fragment}
      afterLeave={() => setRawQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-2xl shadow-slate-300/10 bg-slate-900/70 shadow-2xl ring-1 ring-sky-500 ring-opacity-5 backdrop-blur-xl backdrop-filter transition-all">
              <Combobox
                value=""
                onChange={(item) => {
                  //console.info('You have selected', item)
                  window.open(item, '_blank');
                  
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:ring-0 sm:text-sm focus:outline-0"
                    placeholder="Search GitHub repos..."
                    onChange={

                      (event) => {
                        setRawQuery(event.target.value)
                        //console.log(event.target.value)
                      }
                      
                    }
                    onKeyDown={(event)=>{
                      //console.log(event.code)
                      handleKeyDown(event.code);
                    }}
                  />
                </div>

                <Combobox.Options
                  static
                  className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                >
                  <li>
                    <h2 className="text-xs font-semibold text-gray-200">
                      Repositories
                    </h2>
                    <ul className="-mx-4 mt-2 text-sm text-gray-700 space-y-0.5">
                      {
                        //render search list

                        // testItems.map((i:number,index:number)=>{
                        //   return <RepositoryOption repoName={i.toString()}/>;
                        // })
                        _repoList.map((item:Repository)=>{
                          return <RepositoryOption key={item.id} repo={item}/>;
                        })


                      }
                      
                    </ul>
                  </li>
                </Combobox.Options>
                <span className="flex flex-wrap items-center bg-slate-900/20 py-2.5 px-4 text-xs text-gray-400">
                  <FaceSmileIcon className="w-4 h-4 mr-1" />
                  Welcome to Zolplay&apos;s React Interview Challenge.
                </span>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
