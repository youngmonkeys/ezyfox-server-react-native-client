//
//  AppDelegate.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/25/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "AppDelegate.h"
#import "AppConfigDefine.h"
#include <React/RCTRootView.h>
#include <vector>
#include "EzyHeaders.h"

EZY_USING_NAMESPACE;

@interface AppDelegate ()

@end

std::vector<EzyClient*> clientVector;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    EzyClients::getInstance();
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios"];
    RCTRootView *rootView =
    [[RCTRootView alloc] initWithBundleURL: jsCodeLocation
                                moduleName: @"freechat-react-native"
                         initialProperties: @{}
                             launchOptions: nil];
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [[UIViewController alloc] init];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    
    NSThread* thread = [[NSThread alloc] initWithTarget:self
                                               selector:@selector(loopProcessEvents)
                                                 object:nil];
    [thread start];
    return YES;
}

- (void) loopProcessEvents {
    EzyClients* clients = EzyClients::getInstance();
    while (true) {
        [[NSThread currentThread] setName:@"ezyfox-process-event"];
        dispatch_sync(dispatch_get_main_queue(), ^(void) {
            clients->getClients(clientVector);
            for(int i = 0 ; i < clientVector.size() ; ++i) {
                EzyClient* client = clientVector[i];
                client->processEvents();
            }
        });
        [NSThread sleepForTimeInterval:0.003];
    }
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}


@end
