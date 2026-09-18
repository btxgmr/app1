// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Leaderboard",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "Leaderboard",
            targets: ["Leaderboard"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "Leaderboard",
            dependencies: [],
            path: "Sources/Leaderboard"
        ),
        .testTarget(
            name: "LeaderboardTests",
            dependencies: ["Leaderboard"],
            path: "Tests/LeaderboardTests"
        ),
    ]
)
