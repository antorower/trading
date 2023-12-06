"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Accounts/Requested/RequestedTable";
import LostTable from "@/components/Accounts/Lost/LostTable";

const Accounts = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Account Control Center" subtitle="Manage your accounts" />
      <LostTable />
      <RequestedTable />
    </div>
  );
};

export default Accounts;

/*



<TableWrapper title="Requested Accounts" refresh={true} refreshFunction={UpdateActiveAccounts} panelExpanded={requestedAccountsPanelExpanded} setPanelExpanded={setRequestedAccountsPanelExpanded}>
        <div className="flex justify-between items-center px-2">
          <FirmsCheckbox propFirm="Funding Pips" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={false} />
          <FirmsCheckbox propFirm="Funded Next" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={true} />
          <FirmsCheckbox propFirm="FTMO" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={true} />
          <FirmsCheckbox propFirm="The Funded Trader" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={true} />
          <FirmsCheckbox propFirm="True Forex Funds" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={true} />
          <FirmsCheckbox propFirm="My Forex Funds" selectedPropFirm={requestedCompany} selectPropFirm={setRequestedCompany} disabled={true} />
          <button onClick={(e) => RequestNewAccount(e)} className="btn-primary">
            New Account
          </button>
        </div>
        {activeAccounts && activeAccounts.length > 0 && activeAccounts.some((account) => account.status === "Requested" || account.status === "Registration") && (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollable">
            {activeAccounts.map((account) => {
              if (account.status === "Requested" || account.status === "Registration") {
                return (
                  <TableRow key={account.id}>
                    <div className="flex w-full justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-[30px] h-[30px]">
                          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="company-logo" />
                        </div>
                        <div className="font-weight-500">{account.company}</div>
                      </div>

                      <div className="text-gray-400 font-weight-500 max-w-[850px] text-center">{account.status === "Requested" ? account.comment : account.action}</div>

                      <div className="flex gap-8 items-center">
                        {account.status === "Requested" && (
                          <button onClick={(e) => DeleteRequestedAccount(e, account._id)} className="btn-decline">
                            Delete
                          </button>
                        )}

                        <div className={`relative w-[22px] h-[22px] ${account.status === "Requested" && "animate-spin"}`}>
                          <Image src={`/${account.status === "Requested" ? "spinner" : "tick"}.svg`} fill="true" sizes="32x32" alt="spinner" />
                        </div>
                      </div>
                    </div>
                  </TableRow>
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </TableWrapper>

      */
