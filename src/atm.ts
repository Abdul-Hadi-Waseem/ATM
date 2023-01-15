#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import promptSync from "prompt-sync";
import { userInfo } from "os";
const prompt = promptSync();
interface userInfo {
  id: string;
  pass: string;
  amount: number;
  pinRetries: number;
  accountBlocked: boolean;
}
let userAccounts: userInfo[] = [];
userAccounts.push({
  id: "abdulhadi",
  pass: "1234",
  amount: 10000,
  pinRetries: 0,
  accountBlocked: false,
});
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
};
async function startAtm() {
  let rainbow = chalkAnimation.rainbow("Starting Atm Machine\nKindly Wait!");
  await sleep();
  rainbow.stop();
  // console.log(userAccounts);
  let run: boolean = true;
  while (run) {
    let choices: { UserChoice: string } = await inquirer.prompt([
      {
        name: "UserChoice",
        type: "list",
        choices: ["Create User", "Login", "Exit"],
      },
    ]);
    if (choices.UserChoice == "Exit") {
      run = false;
      console.log(chalk.bgCyanBright("GOOD BYE :)"));
      break;
    } else if (choices.UserChoice == "Create User") {
      let id = prompt("Enter Id: ");
      let pass = prompt.hide("Enter Pass: ");
      let newObj: userInfo = {
        id: id,
        pass: pass,
        amount: 0,
        pinRetries: 0,
        accountBlocked: false,
      };
      userAccounts.push(newObj);
      console.log(chalk.bgCyan("User Successfully Created Now Login!"));
      // console.log(userAccounts);
    } else if (choices.UserChoice == "Login") {
      let enteredInfo: { userid: string; userpass: string } =
        await inquirer.prompt([
          {
            type: "input",
            name: "userid",
            message: "Enter Id",
          },
          {
            type: "password",
            name: "userpass",
            message: "Enter Your Password!",
          },
        ]);
      let found = userAccounts.find((element) => {
        return (
          element.id == enteredInfo.userid &&
          element.pass == enteredInfo.userpass
        );
      });
      // console.log(found);
      if (found) {
        if (found.accountBlocked) {
          console.log(
            chalk.bgRedBright(
              "Your Account Has Been Blocked,Contact Customer Support"
            )
          );
        } else {
          console.log(chalk.bgCyan("User Successfully Logged In!"));
          found.pinRetries = 0;
          while (true) {
            let choices: { userChoice: string } = await inquirer.prompt([
              {
                type: "list",
                name: "userChoice",
                choices: ["View Balance", "Deposit", "Withdraw", "Exit"],
              },
            ]);
            // let looptwo: boolean = true;

            if (choices.userChoice == "View Balance") {
              console.log(
                chalk.blue(`Dear ${found.id} Your Balance Is ${found.amount}`)
              );
            } else if (choices.userChoice == "Deposit") {
              let deposit: { amount: string } = await inquirer.prompt([
                {
                  type: "input",
                  name: "amount",
                  message: "Enter Amount!",
                },
              ]);
              found.amount += +deposit.amount;
              console.log(chalk.blueBright("Amount Successfully Added :)"));
            } else if (choices.userChoice == "Withdraw") {
              let withdrawAmount: { amount: string } = await inquirer.prompt([
                {
                  type: "input",
                  name: "amount",
                  message: "Enter Amount To Withdraw!",
                },
              ]);
              if (+withdrawAmount.amount > found.amount) {
                console.log("Insufficient Funds");
              } else {
                found.amount -= +withdrawAmount.amount;
                console.log(
                  chalk.bgYellowBright("Amound Successfully Withdrawn :)")
                );
              }
            }
            if (choices.userChoice == "Exit") {
              console.log(chalk.bgRedBright("DISPLAYING MAIN MENU"));
              break;
            }
          }
        }
      } else {
        found = userAccounts.find((element) => {
          return element.id == enteredInfo.userid;
        });
        if (found) {
          found.pinRetries += 1;
          console.log(chalk.bgRedBright("Invalid Password"));
          if (found.pinRetries > 3) {
            console.log(
              chalk.bgMagentaBright(
                "Your Account Has Been Blocked For Trying Invalid Password 3 Times :("
              )
            );
            found.accountBlocked = true;
          }
        } else {
          console.log(chalk.bgCyanBright("No User Found"));
        }
      }
    }
  }
}
startAtm();
