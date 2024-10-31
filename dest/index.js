"use strict";
const salesData = [
    { name: "YOU", totalSales: 0, genPath: "1" },
    { name: "A1", totalSales: 138000, genPath: "1.1" },
    { name: "A2", totalSales: 276000, genPath: "1.1.2" },
    { name: "A3", totalSales: 138000, genPath: "1.1.2.3" },
    { name: "A4", totalSales: 414000, genPath: "1.1.2.4" },
    { name: "A5", totalSales: 276000, genPath: "1.1.2.5" },
    { name: "A6", totalSales: 138000, genPath: "1.1.2.3.6" },
    { name: "A7", totalSales: 138000, genPath: "1.1.2.4.7" },
    { name: "A8", totalSales: 138000, genPath: "1.1.2.5.8" },
    { name: "A9", totalSales: 414000, genPath: "1.1.2.5.9" },
    { name: "A10", totalSales: 138000, genPath: "1.1.2.4.7.10" },
    { name: "A11", totalSales: 414000, genPath: "1.1.2.4.7.11" },
    { name: "A12", totalSales: 138000, genPath: "1.1.2.4.7.10.12" },
    { name: "A13", totalSales: 276000, genPath: "1.1.2.4.7.10.12.13" },
    { name: "A14", totalSales: 414000, genPath: "1.1.2.4.7.10.12.13.14" },
    { name: "B1", totalSales: 0, genPath: "1.2" },
    { name: "B2", totalSales: 414000, genPath: "1.2.1" },
    { name: "B3", totalSales: 138000, genPath: "1.2.3" },
    { name: "C1", totalSales: 414000, genPath: "1.3" },
    { name: "C2", totalSales: 138000, genPath: "1.3.1" },
    { name: "C3", totalSales: 276000, genPath: "1.3.2" },
    { name: "C4", totalSales: 414000, genPath: "1.3.3" },
];
const targetAmount = 387000;
const exceedAmount = 774000;
const vnMaxAmount = 414000;
const directChildBonusPercentage = 0.02;
const grandChildBonusPercentage = 0.05;
class SalesNodeClass {
    constructor({ name, totalSales, genPath, isEligible, vnTotalAmount = 0, bonusAmount = 0, children = [] }) {
        this.name = name;
        this.totalSales = totalSales;
        this.genPath = genPath;
        this.isEligible = isEligible;
        this.vnTotalAmount = vnTotalAmount;
        this.bonusAmount = bonusAmount;
        this.children = children;
    }
    get parentGenPath() {
        return SalesNodeClass.getParentGenPath(this.genPath);
    }
    static getParentGenPath(genPath) {
        const genPathArr = genPath.split(".");
        const parentGenPath = genPathArr.length > 1 ? genPathArr.slice(0, -1).join(".") : '';
        return parentGenPath;
    }
}
function arrangeSalesData(salesData) {
    for (let i = salesData.length - 1; i >= 0; i--) {
        const currNode = salesData[i];
        currNode.isEligible = true;
        const parentGenPath = SalesNodeClass.getParentGenPath(currNode.genPath);
        //  if total sales not enough, take from children or pass up to parent
        if (currNode.totalSales < targetAmount) {
            const childrenNode = salesData.filter((node) => currNode.genPath === SalesNodeClass.getParentGenPath(node.genPath));
            const nearestNode = childrenNode
                .sort((a, b) => a.totalSales - b.totalSales)
                .find((node) => node.totalSales >= targetAmount);
            const parentNode = salesData.find((node) => node.genPath === parentGenPath);
            if (!nearestNode && parentNode) {
                parentNode.totalSales += currNode.totalSales;
                currNode.isEligible = false;
                continue;
            }
            if (nearestNode) {
                currNode.totalSales += nearestNode.totalSales;
                nearestNode.isEligible = false;
            }
        }
        // generate virtual node if total sales exceeded
        if (currNode.totalSales >= exceedAmount) {
            currNode.vnTotalAmount = currNode.totalSales - targetAmount;
            currNode.totalSales = targetAmount;
        }
    }
    return salesData;
}
function getParentGenPath(genPath) {
    const genPathArr = genPath.split(".");
    const parentGenPath = genPathArr.length > 1 ? genPathArr.slice(0, -1).join(".") : null;
    return parentGenPath;
}
function getChildrenNode(salesData, parentNode) {
    const childrenNode = salesData.filter((node) => parentNode.genPath === SalesNodeClass.getParentGenPath(node.genPath));
    return childrenNode.length
        ? childrenNode.map((node) => new SalesNodeClass({ ...node, children: getChildrenNode(salesData, node) }))
        : [];
}
function generateGenealogyTree(salesData) {
    const salesDataCopy = salesData.slice();
    const rootNode = salesDataCopy.splice(0, 1)[0];
    const tree = new SalesNodeClass({ ...rootNode, children: getChildrenNode(salesDataCopy, rootNode) });
    return tree;
}
function bonusCalculation(tree) {
    const directChild = tree.children;
    const grandChild = directChild.flatMap((node) => node.children);
    const directChildTotalSales = directChild.reduce((acc, node) => (node.isEligible === true ? acc + node.totalSales : acc), 0);
    const grandChildTotalSales = grandChild.reduce((acc, node) => (node.isEligible === true ? acc + node.totalSales : acc), 0);
    const directVnTotalAmount = directChild.reduce((acc, node) => { var _a; return acc + ((_a = node.vnTotalAmount) !== null && _a !== void 0 ? _a : 0); }, 0);
    const directChildBonus = directChildTotalSales * directChildBonusPercentage;
    const grandChildBonus = (grandChildTotalSales + directVnTotalAmount) * grandChildBonusPercentage;
    return directChildBonus + grandChildBonus;
}
const arrangedSalesData = arrangeSalesData(salesData);
const tree = generateGenealogyTree(arrangedSalesData);
const bonus = bonusCalculation(tree);
console.dir(tree, { depth: null });
console.log(`'YOU' bonus: ${bonus}`);
