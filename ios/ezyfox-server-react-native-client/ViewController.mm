//
//  ViewController.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/25/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "ViewController.h"
#include <React/RCTRootView.h>
#include "EzyHeaders.h"

EZY_USING_NAMESPACE;

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    EzyClients::getInstance();
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios"];
    
    RCTRootView *rootView =
    [[RCTRootView alloc] initWithBundleURL: jsCodeLocation
                                moduleName: @"freechat-react-native"
                         initialProperties: @{}
                             launchOptions: nil];
//    UIViewController *vc = [[UIViewController alloc] init];
//    vc.view = rootView;
    [self.view addSubview:rootView];
//    [self presentViewController:vc animated:YES completion:nil];
    
    NSThread* thread = [[NSThread alloc] initWithTarget:self
                                               selector:@selector(loopProcessEvents)
                                                 object:nil];
    [thread start];
}

- (void) loopProcessEvents {
    while (true) {
        [[NSThread currentThread] setName:@"ezyfox-process-event"];
        dispatch_sync(dispatch_get_main_queue(), ^(void) {
            EzyClients* clients = EzyClients::getInstance();
            std::vector<EzyClient*> clientList = clients->getClients();
            for(int i = 0 ; i < clientList.size() ; i++) {
                EzyClient* client = clientList[i];
                client->processEvents();
            }
        });
        [NSThread sleepForTimeInterval:0.003];
    }
}

- (IBAction)TestClick:(id)sender {
    NSLog(@"High Score Button Pressed");
}
@end
