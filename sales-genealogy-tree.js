const salesData = [
    { name: 'YOU', totalSales: 0, genPath: '1' },
    { name: 'A1', totalSales: 138000, genPath: '1.1' },
    { name: 'A2', totalSales: 276000, genPath: '1.1.2' },
    { name: 'A3', totalSales: 138000, genPath: '1.1.2.3' },
    { name: 'A4', totalSales: 414000, genPath: '1.1.2.4' },
    { name: 'A5', totalSales: 276000, genPath: '1.1.2.5' },
    { name: 'A6', totalSales: 138000, genPath: '1.1.2.3.6' },
    { name: 'A7', totalSales: 138000, genPath: '1.1.2.4.7' },
    { name: 'A8', totalSales: 138000, genPath: '1.1.2.5.8' },
    { name: 'A9', totalSales: 414000, genPath: '1.1.2.5.9' },
    { name: 'A10', totalSales: 138000, genPath: '1.1.2.4.7.10' },
    { name: 'A11', totalSales: 414000, genPath: '1.1.2.4.7.11' },
    { name: 'A12', totalSales: 138000, genPath: '1.1.2.4.7.10.12' },
    { name: 'A13', totalSales: 276000, genPath: '1.1.2.4.7.10.12.13' },
    { name: 'A14', totalSales: 414000, genPath: '1.1.2.4.7.10.12.13.14' },
    { name: 'B1', totalSales: 0, genPath: '1.2' },
    { name: 'B2', totalSales: 414000, genPath: '1.2.1' },
    { name: 'B3', totalSales: 138000, genPath: '1.2.3' },
    { name: 'C1', totalSales: 414000, genPath: '1.3' },
    { name: 'C2', totalSales: 138000, genPath: '1.3.1' },
    { name: 'C3', totalSales: 276000, genPath: '1.3.2' },
    { name: 'C4', totalSales: 414000, genPath: '1.3.3' },
];

const targetAmount = 387000;
const exceedAmount = 774000;
const vnMaxAmount = 414000;

function getParentGenPath(genPath) {
    const splitedGenPath = genPath.split('.');

    const parentGenPath = splitedGenPath.length > 1
        ? splitedGenPath.slice(0, -1).join('.')
        : null;

    return parentGenPath;
}

function generateGenealogyTree(salesData) {
    for (let i = salesData.length - 1; i >= 0; i--) {
        const currNode = salesData[i];

        const parentGenPath = getParentGenPath(currNode.genPath);

        //  if total sales not enough, take from children or pass up to parent
        if (currNode.totalSales < targetAmount) {
            const childrenNode = salesData.filter(node => currNode.genPath === getParentGenPath(node.genPath));

            const nearestNode = childrenNode.sort((a, b) => a.totalSales - b.totalSales).find(node => node.totalSales >= targetAmount);
            const parentNode = salesData.find(node => node.genPath === parentGenPath);

            if (!nearestNode && parentNode) {
                parentNode.totalSales += currNode.totalSales;
                continue;
            }

            if (nearestNode) {
                currNode.totalSales += nearestNode.totalSales;
            }
        }

        // generate virtual node if total sales exceeded
        if (currNode.totalSales >= exceedAmount) {
            const vnTotalAmount = currNode.totalSales - targetAmount;

            currNode.totalSales = targetAmount;
            currNode.vnCount = Math.floor(vnTotalAmount / vnMaxAmount) + 1;
            currNode.vnLastAmount = vnTotalAmount - ((currNode.vnCount - 1) * vnMaxAmount);
        }
    }

    return salesData
}

function calculateBonus(salesData) {
    
}

console.log(generateGenealogyTree(salesData));



// class SalesNode {
//     constructor ({
//         name,
//         totalSales = 0,
//         genPath,
//         children = []
//     }) {
//         this.name = name;
//         this.totalSales = totalSales;
//         this.genPath = genPath;
//         this.children = children;
//     }

//     get parentGenPath() {
//         const splitedGenPath = this.genPath.split('.');

//         const parentGenPath = splitedGenPath.length > 1
//             ? splitedGenPath.slice(0, -1).join('.')
//             : null;

//         return parentGenPath;
//     }
// }


// const salesDataCopy = salesData.slice();
// const rootNode = salesDataCopy.splice(0, 1)[0];

// const salesNode = {
//     [rootNode.genPath]: new SalesNode(rootNode)
// };

// while (salesDataCopy.length > 0) {
//     const childrenNode = salesData.filter(node => parentNode.genPath === node.parentGenPath);
// }

// function getChildrenNode(salesData, parentNode) {

// }
